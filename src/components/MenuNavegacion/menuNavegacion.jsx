import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import MyForm from '../RegistroPlatillo/registrarPlatillo';
import { HomeOutlined, UnorderedListOutlined } from '@ant-design/icons'; // Importa los íconos necesarios
const { Header, Footer } = Layout;
const { SubMenu } = Menu;
import './menuNavegacion.css';

const App2 = () => {
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const items1 = ['Home', 'Platillos Tradicionales'];

  return (
    <Layout className="layout">
      <Header div className="header" >

        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['Platillos Tradicionales']}
          className='menu'
        >
          {items1.map((item) => (
            <Menu.Item key={item}>
              {item === 'Home' && <HomeOutlined />} {/* Agrega ícono para Home */}
              {item === 'Platillos Tradicionales'  && <UnorderedListOutlined />}
              {item === 'Platillos Tradicionales'  && <UnorderedListOutlined />?(
                <SubMenu 
                title={item}
                key={item}
                className={openSubMenu ? 'ant-menu-submenu-open' : ''}
              >
                <Menu.Item key="1"defaultSelectedKeys={['Registrar Platillo']}>Registrar Platillo</Menu.Item>
                <Menu.Item key="2">Mostrar Platillo</Menu.Item>
    
              </SubMenu>
              ):(
                item
              )}
            </Menu.Item>
          ))}
        </Menu>
      </Header>
<MyForm/>

    </Layout>
  );
};

export default App2;
