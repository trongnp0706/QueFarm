import { useState, useEffect } from 'react';
import {
  ArrowUpOutlined,
  PhoneOutlined,
  MessageOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';

const ZaloIcon = () => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
    alt="Zalo"
    className="w-full h-full p-2"
  />
);

const MessengerIcon = () => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg"
    alt="Messenger"
    className="w-full h-full p-1"
  />
);

function FloatingActionButton() {
  const [isScrollVisible, setIsScrollVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsScrollVisible(window.pageYOffset > 200);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-end gap-4">
      {isScrollVisible && (
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<ArrowUpOutlined />}
          onClick={scrollToTop}
          className="bg-gray-600 border-gray-600 hover:bg-gray-700 shadow-lg transition-all duration-300 ease-in-out"
        />
      )}

      <div className="relative flex flex-col items-end">
        <div
          className={`flex flex-col items-end gap-4 transition-all duration-300 ease-in-out mb-3 ${
            isMenuOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <a href="https://m.me/quefarmfood" target="_blank" rel="noopener noreferrer">
            <Button
              shape="circle"
              size="large"
              icon={<MessengerIcon />}
              className="shadow-lg bg-white flex items-center justify-center p-0"
            />
          </a>
          <a href="https://zalo.me/0835286779" target="_blank" rel="noopener noreferrer">
            <Button
              shape="circle"
              size="large"
              icon={<ZaloIcon />}
              className="shadow-lg bg-white flex items-center justify-center p-0"
            />
          </a>
          <a href="tel:0835286779">
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<PhoneOutlined />}
              className="bg-green-600 border-green-600 hover:bg-green-700 shadow-lg"
            />
          </a>
        </div>

        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={isMenuOpen ? <CloseOutlined /> : <MessageOutlined />}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`shadow-lg transition-all duration-200 ${
            isMenuOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        />
      </div>
    </div>
  );
}

export default FloatingActionButton; 