const ctx3 = document.getElementById('azureChart').getContext('2d');

const data3 = {
datasets: [
  {
    label: 'Azure',
    cubicInterpolationMode: 'monotone',
    borderColor: 'blue',
    data: []
  },
  {
    label: 'Global',
    cubicInterpolationMode: 'monotone',
    // borderDash: [8, 4],
    borderColor: 'white',
    data: []
  }

]
};

const onRefresh3 = async chart => {
const now = Date.now();  
const globalcount =  await fetch('/load?cloud=' + 'global', {method:'GET', mode: "cors"}).then(response => response.text());
const azurecount =  await fetch('/load?cloud=' + 'azure', {method:'GET', mode: "cors"}).then(response => response.text());
// console.log("Requesting " + period + " clients ," + localLog);
chart.data.datasets[0].data.push({
    x: now,
    y: azurecount
  });
chart.data.datasets[1].data.push({
    x: now,
    y: globalcount
  });
};


new Chart(ctx3, {
    type: 'line',
    data: data3,
    options: {
      scales: {
        x: {
          type: 'realtime',
          realtime: {
            duration: 30000,
            refresh: 3500,
            delay: 7000,
            onRefresh: onRefresh3
          }
        },
        y: {
          title: {
            display: true,
            text: 'Value'
          },
          max: 100,
          grace: '20%',
          beginAtZero: true
        }
      },
      interaction: {
        intersect: false
      }
    }
});

loadButton();

function loadButton(err) {
  if (err) {
      throw err;
  } document.getElementById('updateAzure').addEventListener('click', async (e) => {
        var cloudElem = document.getElementById('cloud_name_azure');
        var newValues = parseInt(document.getElementById('order_value_azure').value);
        await fetch('/update?cloud=' + cloudElem.selectedOptions[0].value + '&value=' + newValues, {method:'POST', mode: "cors"}).then(response => response.text());

  });
}