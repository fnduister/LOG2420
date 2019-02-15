const handleSubmit = formElement => {
  event.preventDefault();

  const data = new URLSearchParams(new FormData(formElement));

  const init = {
    method: "POST",
    body: data,
    headers: {
      "content-type": "text/html"
    },
    mode: "no-cors"
  };

  try {
    const rep = fetch("http://localhost:8080", init)
      .then(function(res) {
        return res.json();
      })
      .then(function(rese) {
        console.log(JSON.stringify(rese));
      });
    console.log(rep);
    // console.log({ responseJson });
  } catch (err) {
    console.log(err);
  }
};

// window.onload = function() {
//   var btn_submit = document.getElementById("btn_submit");

//   btn_submit.addEventListener("click", function() {
//     var formData = document.getElementById("myform");
//     console.log(formData);
//   });
// };
