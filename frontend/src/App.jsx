import { useEffect } from 'react';
import './App.css'
import AppRouter from './app/routes/AppRouter'
import { ToastContainer } from 'react-toastify';
import { useMyProfileQuery } from './features/auth/api/authApi';
import { setProfile, clearProfile, setLoading } from './features/auth/authSlice';
import { useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch();
  const { data, isLoading, isError, error } = useMyProfileQuery();

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
    } else if (data?.user) {
      dispatch(setProfile(data.user));
    } else if (isError) {
      // Clear profile if token is invalid or expired
      console.error('Profile fetch error:', error);
      dispatch(clearProfile());
    }
  }, [dispatch, data, isLoading, isError, error]);

  return (
    <div className='overflow-hidden'>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
        closeButton={true}
        style={{ zIndex: 99999 }}
      />
      <AppRouter />
    </div>
  )
}

export default App
