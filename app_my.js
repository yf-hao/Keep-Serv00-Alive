const express = require("express");
const path = require("path");
const exec = require("child_process").exec;
const app = express();
const port = 3000;

const user = "Serv00登录用户名"; // 此处修改为Serv00的用户名
const pName = "s5";

app.use(express.static(path.join(__dirname, 'static')));

function keepWebAlive() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();

  // 定义需要守护的进程及其完整命令
  const processes = [
    { name: pName, command: `/home/${user}/.${pName}/${pName} -c /home/${user}/.${pName}/config.json` },
    { name: "web", command: "./web run -c config.json" },
    { name: "argo", command: "./argo.sh" }
  ];

  processes.forEach(({ name, command }) => {
    exec(`pgrep -laf ${name}`, (err, stdout) => {
      if (stdout.includes(command)) {
        console.log(`${formattedDate}, ${formattedTime}: ${name} is running`);
      } else {
        exec(`nohup ${command} >/dev/null 2>&1 &`, (err) => {
          if (err) {
            console.log(`${formattedDate}, ${formattedTime}: Failed to start ${name}: ${err}`);
          } else {
            console.log(`${formattedDate}, ${formattedTime}: Successfully started ${name}`);
          }
        });
      }
    });
  });
}

setInterval(keepWebAlive, 10 * 1000);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}!`);
});
