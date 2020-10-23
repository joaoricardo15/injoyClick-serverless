'use strict';

var axios = require("axios");

module.exports.handler = async event => {

  return new Promise(async (resolve, reject) => {
    let [ahNegao, nIntendo, leNinja, humordido] = await Promise.all([
      getAhNegao(),
      getNintendo(),
      getLeNinja(),
      getHumordido(),
    ]);
    let biggestLenght = ahNegao.length;
    if (nIntendo.length > biggestLenght) biggestLenght = nIntendo.length;
    if (leNinja.length > biggestLenght) biggestLenght = leNinja.length;
    if (humordido.length > biggestLenght) biggestLenght = humordido.length;

    let mixedPosts = [];
    for (let i = 0; i < biggestLenght; i++) {
      if (ahNegao[i]) mixedPosts.push(ahNegao[i]);
      if (nIntendo[i]) mixedPosts.push(nIntendo[i]);
      if (leNinja[i]) mixedPosts.push(leNinja[i]);
      if (humordido[i]) mixedPosts.push(humordido[i]);
    }

    // let allPosts = [
    //   ...ahNegao,
    //   ...nIntendo,
    //   ...leNinja,
    //   ...humordido,
    //   ...kibeLoco,
    // ];
    // const latestPosts = allPosts.sort((a, b) => b.date - a.date);

    resolve(mixedPosts);
  });
}

const getKibeLoco = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("https://www.kibeloco.com.br/")
      .then((result) => {
        if (result.status === 200) {
          const dom = new JSDOM(result.data);
          const posts = dom.window.document.querySelectorAll(".apost");

          let formatedPosts = [];
          for (let i = 0; i < posts.length; i++) {
            const title = posts[i]
              .querySelector(".thetitle a")
              .innerHTML.trim();
            const formatedTitle =
              title.charAt(0).toUpperCase() + title.substring(1).toLowerCase();

            const images = posts[i].querySelectorAll(".entry img");

            for (let i = 0; i < images.length; i++) {
              images[i].setAttribute("width", "100%");
              images[i].setAttribute("height", "");
            }

            const videos = posts[i].querySelectorAll(".entry iframe");

            for (let i = 0; i < videos.length; i++) {
              videos[i].setAttribute("width", "100%");
              videos[i].setAttribute("height", "");
            }

            const monthName = {
              jan: 0,
              fev: 1,
              mar: 2,
              abr: 3,
              mai: 4,
              jun: 5,
              jul: 6,
              ago: 7,
              set: 8,
              out: 9,
              nov: 10,
              dez: 11,
            };
            let formatedDate;
            const timeComponent = posts[i].querySelector(".thetime").innerHTML;
            const dateValues = timeComponent.split(" ");
            if (dateValues[2] > 0) {
              const dia = parseInt(dateValues[0]);
              const month = monthName[dateValues[1]];
              const year = parseInt(dateValues[2]);
              formatedDate = new Date(year, month, dia);
            } else {
              const timeValue = parseInt(timeComponent.split(" ")[0]);
              const timeUnit = timeComponent.split(" ")[1].split(" ")[0];
              formatedDate =
                timeUnit === "horas"
                  ? new Date(new Date().getTime() - timeValue * 3600000)
                  : new Date(new Date().getTime() - timeValue * 86400000);
            }

            formatedPosts.push({
              title: formatedTitle,
              htmlContent: posts[i].querySelector(".entry").innerHTML,
              author: "Kibe Loco",
              authorUrl: "https://www.kibeloco.com.br/",
              date: new Date(formatedDate).getTime(),
              icon:
                "https://www.kibeloco.com.br/wp-content/themes/kibe2018/img/icons/favicon.png",
              url: posts[i].querySelector(".thetitle a").href,
            });
          }
          resolve(formatedPosts);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getAhNegao = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("https://www.ahnegao.com.br/")
      .then((result) => {
        if (result.status === 200) {
          const dom = new JSDOM(result.data);
          const posts = dom.window.document.querySelectorAll("article");

          let formatedPosts = [];
          for (let i = 0; i < posts.length; i++) {
            const title = posts[i]
              .querySelector(".entry-title a")
              .innerHTML.trim();
            const formatedTitle =
              title.charAt(0).toUpperCase() + title.substring(1).toLowerCase();

            const images = posts[i].querySelectorAll(".in img");

            for (let i = 0; i < images.length; i++) {
              images[i].setAttribute("width", "100%");
              images[i].setAttribute("height", "");
            }

            const videos = posts[i].querySelectorAll(".in iframe");

            for (let i = 0; i < videos.length; i++) {
              videos[i].setAttribute("width", "100%");
              videos[i].setAttribute("height", "");
            }

            const monthName = {
              jan: 0,
              fev: 1,
              mar: 2,
              abr: 3,
              mai: 4,
              jun: 5,
              jul: 6,
              ago: 7,
              set: 8,
              out: 9,
              nov: 10,
              dez: 11,
            };
            const dia = parseInt(posts[i].querySelector(".dia").innerHTML);
            const month = monthName[posts[i].querySelector(".mes").innerHTML];
            const year = parseInt(posts[i].querySelector(".ano").innerHTML);
            const formatedDate = new Date(year, month, dia);

            formatedPosts.push({
              title: formatedTitle,
              htmlContent: posts[i].querySelector(".in").innerHTML,
              author: "Ah Negão",
              authorUrl: "https://www.ahnegao.com.br/",
              date: new Date(formatedDate).getTime(),
              url: posts[i].querySelector(".entry-title a").href,
              icon:
                "https://www.ahnegao.com.br/wp-content/themes/s4f_ahnegao_2.0/content/icons/apple-icon-144x144.png",
            });
          }
          resolve(formatedPosts);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getNintendo = () => {
  return new Promise((resolve, reject) => {
    axios
      .request({
        baseURL: "https://www.naointendo.com.br/api/posts/",
        headers: {
          "x-requested-with": "XMLHttpRequest",
        },
      })
      .then((result) => {
        if (result.status === 200) {
          const posts = result.data.posts;
          let formatedPosts = [];
          for (let i = 0; i < posts.length; i++) {
            const title = posts[i].title.trim();
            const formatedTitle =
              title.charAt(0).toUpperCase() + title.substring(1).toLowerCase();

            formatedPosts.push({
              title: formatedTitle,
              description: posts[i].description,
              image: posts[i].type === "image" && {
                imageSource: posts[i].media.content,
                width: parseInt(posts[i].media.size.split("x")[0]),
                height: parseInt(posts[i].media.size.split("x")[1]),
              },
              video: posts[i].type === "video" && {
                videoSource: `https://www.youtube.com/embed/${posts[i].media.content}`,
                width: parseInt(posts[i].media.size.split("x")[0]),
                height: parseInt(posts[i].media.size.split("x")[1]),
              },
              htmlContent: posts[i].type === "html" && posts[i].media.content,
              author: "Ñintendo",
              authorUrl: "https://www.naointendo.com.br",
              date: new Date(posts[i].published_at).getTime(),
              url: `https://www.naointendo.com.br/posts/${posts[i].slug}`,
              icon: "https://www.naointendo.com.br/favicon.ico",
            });
          }
          resolve(formatedPosts);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getLeNinja = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("https://leninja.com.br/")
      .then((result) => {
        if (result.status === 200) {
          const dom = new JSDOM(result.data);
          const posts = dom.window.document.querySelectorAll("article");

          let formatedPosts = [];
          for (let i = 0; i < posts.length; i++) {
            try {
              const title = posts[i]
                .querySelector(".entry-title a")
                .innerHTML.trim();
              const formatedTitle =
                title.charAt(0).toUpperCase() +
                title.substring(1).toLowerCase();
              formatedPosts.push({
                title: formatedTitle,
                image: {
                  imageSource: posts[i].querySelector(
                    ".entry-featured-media img"
                  ).src,
                  width: posts[i].querySelector(".entry-featured-media img")
                    .width,
                  height: posts[i].querySelector(".entry-featured-media img")
                    .height,
                },
                description: posts[i].querySelector(".entry-summary").innerHTML,
                author: "Le Ninja",
                authorUrl: "https://leninja.com.br/",
                date: new Date(
                  posts[i].querySelector(".entry-date").dateTime
                ).getTime(),
                url: posts[i].querySelector(".entry-title a").href,
                icon:
                  "https://leninja.com.br/wp-content/uploads/2019/12/cropped-preto-300x300.png",
              });
            } catch (error) {}
          }
          resolve(formatedPosts);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getHumordido = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("https://www.humordido.net/")
      .then((result) => {
        if (result.status === 200) {
          const dom = new JSDOM(result.data);
          const posts = dom.window.document.querySelectorAll(".post");

          let formatedPosts = [];
          for (let i = 0; i < posts.length; i++) {
            const title = posts[i].querySelector(".title a").innerHTML.trim();
            const formatedTitle =
              title.charAt(0).toUpperCase() + title.substring(1).toLowerCase();

            const images = posts[i].querySelectorAll(".content img");

            for (let i = 0; i < images.length; i++) {
              images[i].setAttribute("width", "100%");
              images[i].setAttribute("height", "");
            }

            const videos = posts[i].querySelectorAll(".content iframe");

            for (let i = 0; i < videos.length; i++) {
              videos[i].setAttribute("width", "100%");
              videos[i].setAttribute("height", "");
            }

            const dateComponent = posts[i].querySelector(".info").innerHTML;
            const dateInfo = dateComponent.split("dia")[1].split("às");
            const dateValues = dateInfo[0].trim().split("/");
            const timeValues = dateInfo[1].trim().split(":");
            const formatedDate = new Date(
              dateValues[2],
              dateValues[1] - 1,
              dateValues[0],
              timeValues[0],
              timeValues[1]
            );

            formatedPosts.push({
              title: formatedTitle,
              htmlContent: posts[i].querySelector(".content").innerHTML,
              author: "Humordido",
              authorUrl: "https://www.humordido.net/",
              date: new Date(formatedDate).getTime(),
              url: posts[i].querySelector(".title a").href,
              icon:
                "https://www.humordido.net/wp-content/themes/humordido_v3/favicons/favicon-32x32.png",
            });
          }
          resolve(formatedPosts);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
