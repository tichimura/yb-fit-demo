const ctx2 = document.getElementById('awsChart').getContext('2d');

const data2 = {
datasets: [
  {
    label: 'B地域@AWS',
    cubicInterpolationMode: 'monotone',
    borderColor: 'orange',
    data: [],
    datalabels: {
      labels: {
        title: 'B地域@AWS'
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

const onRefresh2 = async chart => {
const now = Date.now();  
const globalcount =  await fetch('/load?cloud=' + 'global', {method:'GET', mode: "cors"}).then(response => response.text());
const awscount =  await fetch('/load?cloud=' + 'aws', {method:'GET', mode: "cors"}).then(response => response.text());
// console.log("Requesting " + period + " clients ," + localLog);
chart.data.datasets[0].data.push({
    x: now,
    // y: globalcount
    y: awscount
  });
chart.data.datasets[1].data.push({
    x: now,
    y: globalcount
  });
// chart.options.plugins.annotation.annotations.line.value = awscount;
// chart.options.plugins.annotation.annotations.line.label.content = 'B地域@AWSの価格: ' + awscount;
};


new Chart(ctx2, {
    plugins: [ChartDataLabels],
    type: 'line',
    data: data2,
    options: {
      scales: {
        x: {
          type: 'realtime',
          realtime: {
            duration: 30000,
            refresh: 3500,
            delay: 7000,
            onRefresh: onRefresh2
          }
        },
        y: {
          title: {
            display: true,
            text: '価格 ( 円 )'
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
        //       borderColor: 'Orange',
        //       borderWidth: 5,
        //       label: {
        //         backgroundColor: 'Orange',
        //         content: 'AWS',
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
  } document.getElementById('updateAws').addEventListener('click', async (e) => {
        var cloudElem = document.getElementById('cloud_name_aws');
        var newValues = parseInt(document.getElementById('order_value_aws').value);
        await fetch('/update?cloud=' + cloudElem.selectedOptions[0].value + '&value=' + newValues, {method:'POST', mode: "cors"}).then(response => response.text());

  });
}