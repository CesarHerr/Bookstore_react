import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoading: false,
  books: [],
  error: undefined,
};

const fetchBooks = createAsyncThunk('books/fetchUsers', async () => {
  try {
    const response = await axios.get(
      'https://us-central1-bookstore-api-e63c8.cloudfunctions.net/bookstoreApi/apps/RLFYv22wEz7EmmbbyrPK/books',
    );
    return response.data;
  } catch (error) {
    throw error.response;
  }
});

const baseURL = 'https://us-central1-bookstore-api-e63c8.cloudfunctions.net/bookstoreApi/apps/RLFYv22wEz7EmmbbyrPK/books/';
const axiosInstance = axios.create({ baseURL });

const createBook = createAsyncThunk(
  'books/createBook',
  async (bookData, thunkAPI) => {
    try {
      const options = {
        method: 'POST',
        data: bookData,
      };

      const response = await axiosInstance.request(options);
      if (response.data === 'Created') {
        thunkAPI.dispatch(fetchBooks());
      }
      return bookData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(createBook.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload;
      })
      .addCase(createBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export default bookSlice.reducer;
export { fetchBooks, createBook };
