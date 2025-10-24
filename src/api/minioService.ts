import axios from 'axios';

export const getFileUrl = async (fileId: string) => {
  console.log('%csrc/api/minioService.ts:4 fileId', 'color: #007acc;', fileId);
  return axios
    .get(`${process.env.EXPO_PUBLIC_SERVER}/file/${fileId}`)
    .then(res => res.data.url);
};

export const uploadFile = async (formData: any): Promise<string> => {
  return await axios
    .post(`${process.env.EXPO_PUBLIC_SERVER}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(res => res.data.id);
};
