import * as tf from '@tensorflow/tfjs';
import { Matrix } from 'ml-matrix';
import { RandomForestRegression as RandomForest } from 'ml-random-forest';

export interface ForecastResult {
  predictions: number[];
  confidence: number;
  anomalies: number[];
  trends: {
    direction: 'up' | 'down' | 'stable';
    strength: number;
  };
}

export interface ScenarioParams {
  marketingBudget: number;
  pricing: number;
  seasonality: number;
  competitorActivity: number;
}

export class AIForecastingService {
  private model: tf.LayersModel | null = null;
  private randomForest: RandomForest | null = null;
  private historicalData: number[][] = [];
  private lastUpdate: Date = new Date();

  async initialize(historicalData: number[][]) {
    this.historicalData = historicalData;
    await this.trainModels();
  }

  private async trainModels() {
    // LSTM Model for Time Series
    this.model = tf.sequential({
      layers: [
        tf.layers.lstm({ units: 50, returnSequences: true, inputShape: [null, 1] }),
        tf.layers.lstm({ units: 50, returnSequences: false }),
        tf.layers.dense({ units: 1 })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'meanSquaredError'
    });

    // Random Forest for Feature Importance
    const X = this.historicalData.map(row => row.slice(0, -1));
    const y = this.historicalData.map(row => row[row.length - 1]);
    
    this.randomForest = new RandomForest({
      nEstimators: 100,
      maxDepth: 10,
      seed: 42
    });

    this.randomForest.train(X, y);
  }

  async forecast(horizon: number): Promise<ForecastResult> {
    if (!this.model || !this.randomForest) {
      throw new Error('Models not initialized');
    }

    // Prepare input data
    const input = tf.tensor3d(this.historicalData.slice(-horizon), [1, horizon, 1]);
    
    // Generate predictions
    const predictions = await this.model.predict(input) as tf.Tensor;
    const predictionValues = Array.from(await predictions.data());

    // Calculate confidence based on model uncertainty
    const confidence = this.calculateConfidence(predictionValues);

    // Detect anomalies using statistical methods
    const anomalies = this.detectAnomalies(predictionValues);

    // Analyze trends
    const trends = this.analyzeTrends(predictionValues);

    return {
      predictions: predictionValues,
      confidence,
      anomalies,
      trends
    };
  }

  async simulateScenario(params: ScenarioParams): Promise<ForecastResult> {
    // Adjust historical data based on scenario parameters
    const adjustedData = this.applyScenarioParams(this.historicalData, params);
    
    // Create temporary model for scenario
    const scenarioModel = await this.createScenarioModel(adjustedData);
    
    // Generate forecasts with adjusted data
    const forecast = await this.generateScenarioForecast(scenarioModel, adjustedData);
    
    return forecast;
  }

  private calculateConfidence(predictions: number[]): number {
    const variance = this.calculateVariance(predictions);
    const standardError = Math.sqrt(variance / predictions.length);
    return Math.max(0, 1 - standardError);
  }

  private detectAnomalies(data: number[]): number[] {
    const mean = data.reduce((a, b) => a + b) / data.length;
    const stdDev = Math.sqrt(this.calculateVariance(data));
    const threshold = 2 * stdDev;

    return data.reduce((anomalies: number[], value, index) => {
      if (Math.abs(value - mean) > threshold) {
        anomalies.push(index);
      }
      return anomalies;
    }, []);
  }

  private analyzeTrends(data: number[]): { direction: 'up' | 'down' | 'stable'; strength: number } {
    const changes = data.slice(1).map((value, index) => value - data[index]);
    const averageChange = changes.reduce((a, b) => a + b) / changes.length;
    const strength = Math.abs(averageChange) / data[0];

    return {
      direction: averageChange > 0.01 ? 'up' : averageChange < -0.01 ? 'down' : 'stable',
      strength: Math.min(1, strength)
    };
  }

  private calculateVariance(data: number[]): number {
    const mean = data.reduce((a, b) => a + b) / data.length;
    return data.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / (data.length - 1);
  }

  private applyScenarioParams(data: number[][], params: ScenarioParams): number[][] {
    return data.map(row => {
      const adjustedRow = [...row];
      adjustedRow[0] *= (1 + params.marketingBudget / 100);
      adjustedRow[1] *= (1 + params.pricing / 100);
      adjustedRow[2] *= (1 + params.seasonality / 100);
      return adjustedRow;
    });
  }

  private async createScenarioModel(data: number[][]): Promise<tf.LayersModel> {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 64, activation: 'relu', inputShape: [data[0].length] }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 1 })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });

    return model;
  }

  private async generateScenarioForecast(
    model: tf.LayersModel,
    data: number[][]
  ): Promise<ForecastResult> {
    const predictions = await model.predict(tf.tensor2d(data)) as tf.Tensor;
    const predictionValues = Array.from(await predictions.data());

    return {
      predictions: predictionValues,
      confidence: this.calculateConfidence(predictionValues),
      anomalies: this.detectAnomalies(predictionValues),
      trends: this.analyzeTrends(predictionValues)
    };
  }

  async updateModel(newData: number[][]): Promise<void> {
    this.historicalData = [...this.historicalData, ...newData];
    this.lastUpdate = new Date();
    await this.trainModels();
  }

  getModelMetrics(): { lastUpdate: Date; dataPoints: number; accuracy: number } {
    return {
      lastUpdate: this.lastUpdate,
      dataPoints: this.historicalData.length,
      accuracy: this.calculateModelAccuracy()
    };
  }

  private calculateModelAccuracy(): number {
    if (!this.randomForest || this.historicalData.length === 0) {
      return 0;
    }

    const testData = this.historicalData.slice(-Math.floor(this.historicalData.length * 0.2));
    const X_test = testData.map(row => row.slice(0, -1));
    const y_test = testData.map(row => row[row.length - 1]);
    
    const predictions = this.randomForest.predict(X_test);
    const mse = predictions.reduce((sum, pred, i) => sum + Math.pow(pred - y_test[i], 2), 0) / predictions.length;
    
    return 1 - Math.min(1, Math.sqrt(mse) / y_test.reduce((a, b) => a + b) * y_test.length);
  }
}

export const aiForecasting = new AIForecastingService();