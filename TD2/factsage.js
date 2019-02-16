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

const getOutput1 = data => {
  const gaz = data.filter(ele => ele.conditions.type == "gaz_ideal");
};

const getOutput2 = data => {
  let dataElement = "<table>",
    libelle = "",
    unite = "",
    valeur = "";
  for (element of data) {
    libelle += `<th>${element.libelle}</th>`;
    unite += `<th>${element.unite}</th>`;
    valeur += `<td>${parseInt(element.valeur).toExponential(2)}</td>`;
  }
  dataElement += `<tr>${libelle}</tr>`;
  dataElement += `<tr>${unite}</tr>`;
  dataElement += `<tr>${valeur}</tr></table>`;
  return dataElement;
};

const displayTable = (data, parentElement) => {
  console.log({ data });
  const tableFinal =
    getParameterTable(data) +
    getFormuleTable(data.formule) +
    getOutput2(data.output2);
  parentElement.innerHTML = tableFinal;
};

const getFormuleTable = formule => {
  const constituents = formule.split(" +  ");
  let constituentsElement =
    '<table id="constituents"><tr><th>STREAM CONSTITUENTS</th><th>AMOUNT/mol</th></tr>';
  for (constituent of constituents) {
    const values = constituent.split(" ");
    let number, word;
    if (values.length > 1) {
      number = values[0];
      word = values[1];
    } else {
      number = 1;
      word = values[0];
    }

    constituentsElement += `<tr>
        <td> ${word}</td>
        <td>${parseInt(number).toExponential(2)}</td>
    </tr>`;
  }
  return constituentsElement + "</table>";
};

const getParameterTable = data => {
  const parametres = data.output1[0].conditions;
  const temperature = `${parametres.temperature.valeur} ${
    parametres.temperature.unite
  }`;

  const pression = `${parametres.pression.valeur} ${parametres.pression.unite}`;

  return `<table id="param">
      <tr>
        <td>T</td>
        <td>=</td>
        <td>${temperature}</td>
      </tr>
      <tr>
        <td>P</td>
        <td>=</td>
        <td>${pression}</td>
      </tr>
      <tr>
        <td>V</td>
        <td>=</td>
        <td>0 dm3</td>
      </tr>
    </table>`;
};
