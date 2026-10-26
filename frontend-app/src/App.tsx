import React, { useState } from "react";
import { FileAddOutlined, LoginOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import Fornecedores from "./components/layout/Fornecedores";
import { useNavigate } from "react-router-dom";
import { Fornecedor } from "./services/FornecedorService";
import CommomHeader from "./components/common/CommomHeader";
import CommomFooter from "./components/common/CommomFooter";
import SiderLogo from "./components/common/SiderLogo";
import { useAuth } from "./contexts/AuthContext";
import useWindowSize from "./hooks/useWindowSize";

const { Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>();

  const navigate = useNavigate();
  const { width } = useWindowSize();
  const { usuario } = useAuth();

  const handleNavigate = (link: string) => {
    navigate(link);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="sm"
        width={width >= 768 ? 200 : 60}
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
      >
        <SiderLogo />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: usuario ? <FileAddOutlined /> : <LoginOutlined />,
              label: usuario ? "Adicionar" : "Entrar",
              onClick: () => handleNavigate(usuario ? "/create" : "/login"),
            },
          ]}
        />
      </Sider>
      <Layout>
        <CommomHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className="border-2"
        >
          <Fornecedores
            fornecedores={fornecedores}
            setFornecedores={setFornecedores}
          />
        </Content>
        <CommomFooter />
      </Layout>
    </Layout>
  );
};

export default App;
