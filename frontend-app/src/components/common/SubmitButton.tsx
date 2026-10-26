import { Button, Form, FormInstance } from "antd";
import { Dispatch, SetStateAction, useEffect } from "react";

interface SubmitButtonProps {
    form: FormInstance;
    submittable: boolean;
    setSubmittable: Dispatch<SetStateAction<boolean>>
  }
  
  const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({
    form,
    setSubmittable,
    submittable,
    children,
  }) => {
  
    // Watch all values
    const values = Form.useWatch([], form);
  
    useEffect(() => {
      form
        .validateFields({ validateOnly: true })
        .then(() => setSubmittable(true))
        .catch(() => setSubmittable(false));
    }, [form, values, setSubmittable]);
  
    return (
      <Button type="primary" htmlType="submit" disabled={!submittable}>
        {children}
      </Button>
    );
  };

  export default SubmitButton