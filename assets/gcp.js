const ctx1 = document.getElementById('gcpChart').getContext('2d');

const data1 = {
datasets: [
  {
    label: 'A地域@GCP',
    cubicInterpolationMode: 'monotone',
    borderColor: 'green',
    data: [],
    datalabels: {
      labels: {
        title: 'A地域@GCP'
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

const onRefresh1 = async chart => {
const now = Date.now();  
const globalcount =  await fetch('/load?cloud=' + 'global', {method:'GET', mode: "cors"}).then(response => response.text());
const gcpcount =  await fetch('/load?cloud=' + 'gcp', {method:'GET', mode: "cors"}).then(response => response.text());
// console.log("Requesting " + period + " clients ," + localLog);
chart.data.datasets[0].data.push({
    x: now,
    // y: globalcount
    y: gcpcount
  });
chart.data.datasets[1].data.push({
    x: now,
    y: globalcount
  });
// chart.options.plugins.annotation.annotations.line.value = gcpcount;
// chart.options.plugins.annotation.annotations.line.label.content = 'A地域@GCPの価格: ' + gcpcount;
};


new Chart(ctx1, {
    plugins: [ChartDataLabels],
    type: 'line',
    data: data1,
    options: {
      scales: {
        x: {
          type: 'realtime',
          realtime: {
            duration: 30000,
            refresh: 3500,
            delay: 7000,
            onRefresh: onRefresh1
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
        //       borderColor: 'Green',
        //       borderWidth: 5,
        //       label: {
        //         backgroundColor: 'Green',
        //         content: 'GCP',
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
  } document.getElementById('updateGcp').addEventListener('click', async (e) => {
        var cloudElem = document.getElementById('cloud_name_gcp');
        var newValues = parseInt(document.getElementById('order_value_gcp').value);
        await fetch('/update?cloud=' + cloudElem.selectedOptions[0].value + '&value=' + newValues, {method:'POST', mode: "cors"}).then(response => response.text());

  });
}