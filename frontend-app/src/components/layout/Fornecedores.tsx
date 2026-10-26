import { Popconfirm, Space, Table } from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import type { TableColumnsType } from "antd";
import fornecedorService, {
  Fornecedor,
} from "../../services/FornecedorService";
import FornecedorModal from "./FornecedorModal";

type FornecedoresProps = {
  fornecedores: Fornecedor[] | undefined;
  setFornecedores: Dispatch<SetStateAction<Fornecedor[] | undefined>>;
};

interface DataType {
  key: string;
  id: string;
  nome: string;
  cnpjCpf: string;
  email: string;
  celular: string;
  nomeRepresentante: string;
  produtosServicos: string;
  dataCadastro: string;
  endereco: string;
}

const Fornecedores = ({ fornecedores, setFornecedores }: FornecedoresProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFornecedor, setSeletectedFornecedor] = useState<Fornecedor>();

  useEffect(() => {
    const fetchAllFornecedores = async () => {
      try {
        const response = await fornecedorService.getAllFornecedores();
        setFornecedores(response);
      } catch (error) {
        console.log("Falha ao buscar fornecedores: ", error);
        throw error;
      }
    };

    fetchAllFornecedores();
  }, [setFornecedores]);

  const handleDelete = async (id: string) => {
    try {
      await fornecedorService.deleteForecedor(id);
      setFornecedores((prev) =>
        prev?.filter((fornecedor) => fornecedor.id !== id)
      );
    } catch (error) {
      throw error;
    }
  };

  const handleVisualize = async (id: string) => {
    try {
      showLoading();
      const fornecedor = await fornecedorService.getFornecedor(id);
      setSeletectedFornecedor(fornecedor);
    } catch (error) {
      throw error;
    }
  };

  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const collumns: TableColumnsType<DataType> = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Produtos/Serviços",
      dataIndex: "produtosServicos",
      key: "produtosServicos",
    },
    {
      title: "Endereço",
      dataIndex: "endereco",
      key: "endereco",
    },
    {
      title: "Ação",
      key: "ação",
      render: (record: Fornecedor) => (
        <Space size="middle">
          <span className="cursor-pointer">
            <Popconfirm
              placement="topLeft"
              onConfirm={() => handleDelete(record.id)}
              title="Deletar um funcionário"
              description="Tem certeza que deseja deletar este funcionário ?"
              icon={
                <ExclamationCircleOutlined
                  style={{
                    color: "red",
                  }}
                />
              }
            >
              <DeleteOutlined />
            </Popconfirm>
          </span>
          <span className="cursor-pointer">
            <EyeOutlined onClick={() => handleVisualize(record.id)} />
          </span>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="w-full overflow-auto">
        <Table
          dataSource={fornecedores?.map((fornecedor) => ({
            ...fornecedor,
            key: fornecedor.id,
          }))}
          columns={collumns}
        />
      </div>
      {/* <List dataSource={fornecedores} renderItem={(fornecedor) => (<List.Item>
        <List.Item.Meta
          title={fornecedor.nome}
          description={`Email:${fornecedor.email} - Produtos/Serviços${fornecedor.produtosServicos} - Endereço: ${fornecedor.endereco}`}
        />
      </List.Item>)}/> */}
      <FornecedorModal
        content={selectedFornecedor}
        open={open}
        loading={loading}
        setOpen={setOpen}
      />
    </>
  );
};

export default Fornecedores;
