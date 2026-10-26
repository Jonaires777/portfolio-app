import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Button, Dropdown, theme } from "antd"
import { Header } from "antd/es/layout/layout"
import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useWindowSize from "../../hooks/useWindowSize";

type CommomHeaderProps = {
    collapsed: boolean;
    setCollapsed: Dispatch<SetStateAction<boolean>>
}



const CommomHeader = ({ collapsed, setCollapsed}: CommomHeaderProps) => {
    const {
        token: { colorBgContainer },
      } = theme.useToken();
    const { usuario, loading, signOut } = useAuth();
    const navigate = useNavigate();
    const { width } = useWindowSize();

    const handleSignOut = () => {
        signOut();
        navigate("/");
    }

    return(
        <Header
            className="flex items-center justify-between border-b-2"
            style={{ padding: 0, background: colorBgContainer }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div className="pr-4">
              {!loading && (usuario ? (
                <Dropdown
                  trigger={["click"]}
                  menu={{
                    items: [
                      { key: "email", label: usuario.email || usuario.nome, disabled: true },
                      { type: "divider" },
                      { key: "logout", icon: <LogoutOutlined />, label: "Sair", onClick: handleSignOut },
                    ],
                  }}
                >
                  <Button type="text" className="flex items-center gap-2 h-auto py-1">
                    <Avatar size="small" src={usuario.avatarUrl || undefined} icon={<UserOutlined />} />
                    {width >= 768 && <span>{usuario.nome}</span>}
                  </Button>
                </Dropdown>
              ) : (
                <Button type="primary" onClick={() => navigate("/login")}>
                  Entrar
                </Button>
              ))}
            </div>
          </Header>
    )
}

export default CommomHeader
