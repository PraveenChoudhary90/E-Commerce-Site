export const imageBase64Convertor = (e, setFunc,setPreviewImg) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result;
      const base64StringArray = base64String.split('base64,')[1];
      setFunc(base64StringArray);
      return reader.result;
      
    };
    reader.readAsDataURL(file);
  }
};
