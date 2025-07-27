import axios from 'axios';

const API_URL = 'http://localhost:3005/api/tasks';

export const getTodos = () => axios.get(API_URL);

export const getTodo = (id: number) => axios.get(`${API_URL}/${id}`);

export const createTodo = (todo: { title: string; description: string; completed: boolean; user_id: number }) => axios.post(API_URL, todo); 

export const updateTodo = (id: number, todo: { title: string; description: string; completed: boolean }) => axios.put(`${API_URL}/${id}`, todo);

export const deleteTodo = (id: number) => axios.delete(`${API_URL}/${id}`);