type InputHelpTextProps = {
  errors: any;
  name: string;
  children: React.ReactNode;
};

const InputHelpText: React.FC<InputHelpTextProps> = ({
  errors,
  name,
  children,
  ...props
}) => {
  const errorObj = name.split(".").reduce((acc, curr) => acc?.[curr], errors);
  const errorClass = errorObj
    ? ["text-red-600"]
    : ["text-gray-600", "dark:text-gray-400"];

  return (
    <p className={["text-sm", ...errorClass].join(" ")} {...props}>
      {errorObj?.message ? errorObj.message : children}
    </p>
  );
};

export function inputStatusColor(
  errors: any,
  name: string
): "failure" | undefined {
  const errorObj = name.split(".").reduce((acc, curr) => acc?.[curr], errors);
  return errorObj ? "failure" : undefined;
}

export default InputHelpText;
