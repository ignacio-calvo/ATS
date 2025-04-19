import axios from 'axios';
import { ATSPostulants } from '../DTOs/ATSPostulants';

const API_BASE_URL = 'https://api.hiringroom.com/v0';

export class ATSService {
  private token: string | null = null;

  async authenticate(): Promise<void> {
    const clientId = process.env.ATS_CLIENT_ID;
    const clientSecret = process.env.ATS_CLIENT_SECRET;
    const username = process.env.ATS_USERNAME;
    const password = process.env.ATS_PASSWORD;

    if (!clientId || !clientSecret || !username || !password) {
      throw new Error('Missing required environment variables for ATS authentication');
    }

    const response = await axios.post(`${API_BASE_URL}/authenticate/login/users`, {
      grand_type: 'password',
      client_id: clientId,
      client_secret: clientSecret,
      username,
      password,
    });

    this.token = response.data.token;
  }

  async getPostulants(page: number = 0, pageSize: number = 20, filters: { vacancyId?: string; email?: string; nombre?: string; apellido?: string; stage?: string; status?: 'todos' | 'activos' | 'rechazados' } = {}): Promise<ATSPostulants> {
    if (!this.token) {
      throw new Error('Not authenticated. Please call authenticate() first.');
    }

    const response = await axios.get(`${API_BASE_URL}/postulants`, {
      params: {
        page,
        pageSize,
        token: this.token,
        ...filters,
      },
    });

    return response.data;
  }
}