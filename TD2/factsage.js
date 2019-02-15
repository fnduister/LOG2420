const handleSubmit = async formElement => {
  event.preventDefault();

  const data = new URLSearchParams(new FormData(formElement));

  const init = {
    method: "POST",
    body: data
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
  const parametres = data.output1;
  console.log({ parametres });
  // <table id="param">
  //     <tr>
  //       <td>T</td>
  //       <td>=</td>
  //       <td>298.15 K</td>
  //     </tr>
  //     <tr>
  //       <td>P</td>
  //       <td>=</td>
  //       <td>1 atm</td>
  //     </tr>
  //     <tr>
  //       <td>V</td>
  //       <td>=</td>
  //       <td>0 dm3</td>
  //     </tr>
  //   </table>
};
