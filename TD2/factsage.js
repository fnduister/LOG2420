const handleSubmit = async formElement => {
  event.preventDefault();

  const data = new URLSearchParams(new FormData(formElement));

  const init = {
    method: "POST",
    body: data,
  };

  try {
    const dataElement = document.querySelector("#dataTable");
    dataElement.innerHTML = '<img src="img/loader.gif" alt="loader">';
    const response = await fetch("http://localhost:8080", init);
    JSONResponse = await response.json();  
    displayTable(JSONResponse, dataElement);
  } catch (err) {
    console.log(err);
  }
};

const displayTable = (data, parentElement) => {
  
}