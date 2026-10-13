import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

export interface UploadResult {
  message: string;
  downloadUrl: string;
}

export interface HistoryItem {
  _id: string;
  type: 'txt-to-pdf' | 'form-to-pdf';
  originalName: string;
  fileSize: number;
  generatedFile: string;
  createdAt: string;
}

export interface HistoryResponse {
  history: HistoryItem[];
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
}

export const uploadFile = async (
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await API.post<UploadResult>('/transform/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percent);
      }
    },
  });

  return response.data;
};

export const generatePdfFromForm = async (
  formData: FormData
): Promise<UploadResult> => {
  const response = await API.post<UploadResult>(
    '/transform/form-to-pdf',
    formData
  );
  return response.data;
};

export const getHistory = async (): Promise<HistoryResponse> => {
  const response = await API.get<HistoryResponse>('/history');
  return response.data;
};

export const deleteHistoryEntry = async (id: string): Promise<void> => {
  await API.delete(`/history/${id}`);
};
