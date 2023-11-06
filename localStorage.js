const STORAGE_KEY = 'signatures';

export const saveSignature = (signature) => {
  const signatures = getSignatures();
  signatures.push(signature);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signatures));
};

export const getSignatures = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const deleteSignature = (index) => {
  const signatures = getSignatures();
  signatures.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signatures));
};
