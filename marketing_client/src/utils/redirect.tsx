const redirectTo = (path: string) => {
  // simple redirect utility for non-hook usage
  if (typeof window !== 'undefined') {
    window.location.pathname = path;
  }
};

export default redirectTo;