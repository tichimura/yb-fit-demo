const ctx3 = document.getElementById('azureChart').getContext('2d');

const data3 = {
datasets: [
  {
    label: 'C地域@Azure',
    cubicInterpolationMode: 'monotone',
    borderColor: 'blue',
    data: [],
    datalabels: {
      labels: {
        title: 'C地域'
      }
    }
  },
  {
    label: '全体の発注数',
    cubicInterpolationMode: 'monotone',
    // borderDash: [8, 4],
    borderColor: 'gray',
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
    // y: globalcount
    y: azurecount
  });
chart.data.datasets[1].data.push({
    x: now,
    y: globalcount
  });
// chart.options.plugins.annotation.annotations.line.value = azurecount;
// chart.options.plugins.annotation.annotations.line.label.content = 'C地域@Azureの価格: ' + azurecount;
};


new Chart(ctx3, {
    plugins: [ChartDataLabels],
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
            text: '発注数'
          },
          max: 200,
          grace: '20%',
          beginAtZero: true
        }
      },
      interaction: {
        intersect: false
      },
      plugins: {
        datalabels: {
          backgroundColor: context => context.dataset.borderColor,
          padding: 4,
          borderRadius: 4,
          clip: true,
          color: 'white',
          font: {
            weight: 'bold'
          },
          formatter: value => value.y
        },
        // annotation: {
        //   annotations: {
        //     line: {
        //       drawTime: 'afterDatasetsDraw',
        //       type: 'line',
        //       scaleID: 'y',
        //       value: 10,
        //       borderColor: 'Blue',
        //       borderWidth: 5,
        //       label: {
        //         backgroundColor: 'Blue',
        //         content: 'Azure',
        //         enabled: true
        //       }
        //     }
        //   }
        // }
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