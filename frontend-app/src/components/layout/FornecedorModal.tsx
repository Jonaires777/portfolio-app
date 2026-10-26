import { Dispatch, SetStateAction } from "react";
import { Descriptions, DescriptionsProps, Modal } from "antd";
import { Fornecedor } from "@/src/services/FornecedorService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

type FornecedorModalProps = {
  open: boolean;
  content: Fornecedor | undefined;
  loading: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const FornecedorModal = ({
  content,
  loading,
  open,
  setOpen,
}: FornecedorModalProps) => {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const items: DescriptionsProps["items"] = [
    { key: "1", label: "Nome", children: content?.nome },
    { key: "2", label: "CPF/CNPJ", children: content?.cnpjCpf },
    { key: "3", label: "Email", children: content?.email },
    { key: "4", label: "Data de cadastro", children: content?.dataCadastro },
    { key: "5", label: "Telefone", children: content?.celular },
    {
      key: "6",
      label: "Representante",
      children: content?.nomeRepresentante,
    },
    { key: "7", label: "Endereço", children: content?.endereco },
    {
      key: "8",
      label: "Produtos/Serviços",
      children: content?.produtosServicos,
    },
  ];

  return (
    <>
      <Modal
        loading={loading}
        open={open}
        okText={"Editar"}
        cancelText={"Fechar"}
        onOk={() => navigate(`/edit/${content?.id}`)}
        onCancel={() => setOpen(false)}
        okButtonProps={{ style: usuario ? undefined : { display: "none" } }}
        closeIcon={false}
      >
        <Descriptions
          title={`Informações do Fornecedor`}
          layout="vertical"
          items={items}
        />
      </Modal>
    </>
  );
};

export default FornecedorModal;
