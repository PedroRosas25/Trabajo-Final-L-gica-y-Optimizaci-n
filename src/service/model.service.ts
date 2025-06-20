// 📁 src/model/model.service.ts
import { Injectable } from '@nestjs/common';
import * as csv from 'csv-parse/sync';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ModelService {
  parseCsv(file: Express.Multer.File) {
    const records = csv.parse(file.buffer.toString(), { columns: true });
    return { data: records };
  }

  async executeModel(data: any) {
    const apiKey = process.env.IBM_API_KEY;
    const instanceId = process.env.IBM_INSTANCE_ID;
    const url = process.env.IBM_DEPLOYMENT_URL;

    // 🔐 Obtener token de acceso
    const tokenRes = await fetch('https://iam.cloud.ibm.com/identity/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `apikey=${apiKey}&grant_type=urn:ibm:params:oauth:grant-type:apikey`,
    });

    const tokenData = await tokenRes.json() as { access_token: string };
    const accessToken = tokenData.access_token;

    // ▶️ Ejecutar el modelo
    const response = await fetch(`${url}/predictions?version=2021-06-01`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        input_data: [{
          fields: Object.keys(data[0]),
          values: data.map((row: any) => Object.values(row))
        }]
      }),
    });

    const result = await response.json() as { metadata?: { id?: string } };
    const runId = result?.metadata?.id || 'mock-run-id';

    return { runId };
  }

  async checkRunStatus(runId: string) {
    // ⚠️ Esto es un mock temporal — reemplazar por llamada real si el modelo lo permite
    return { runId, status: 'completed' };
  }

  async getResults(runId: string) {
    // ⚠️ Mock — adaptar según la estructura real de salida del modelo
    return {
      BlendSolution: [
        { yearId: 1, value: 100 },
        { yearId: 2, value: 80 }
      ],
      OreSolution: [],
      OpenSolution: [],
      WorkSolution: []
    };
  }
}
