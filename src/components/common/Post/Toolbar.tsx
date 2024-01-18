const Toolbar = () => {
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
          [{ align: [] }],
        ],
        [{ color: [] }, { background: [] }],
        ["link", "image"],
      ],
    },
  };

  return modules;
};

export default Toolbar;
