import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

// 1. Define an interface for the props, extending React.PropsWithChildren
interface LayoutProps extends React.PropsWithChildren {}

// 2. Use React.FC<LayoutProps> and destructure the props
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className='my-20'>{children}</div>
      <Footer />
    </div>
  );
};

export default Layout; // Use 'const' definition above and export here
