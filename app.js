const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = "F8_PLAYER";

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  playedIndexes: [],
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "4 mùa thương em",
      singer: "Lập Nguyên",
      path: "assets/music/4MuaThuongEm-LapNguyen-8365312.mp3",
      image: "https://i.ytimg.com/vi/FCmsrbP-fLM/maxresdefault.jpg",
    },
    {
      name: "À Lôi",
      singer: "Double2T - Masew",
      path: "assets/music/ALoi-Double2TMasew-10119691.mp3",
      image:
        "https://i.ytimg.com/vi/i9cg8cSOlS8/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGEcgUihlMA8=&rs=AOn4CLCjuxvSBq2kZs9uh5tjqJVKARJpiQ",
    },
    {
      name: "Cô gái này là của ai",
      singer: "Kri * Rush",
      path: "assets/music/CoGaiNayLaCuaAi-KrixRushDoanQuocVinhNhiNhi-6926198.mp3",
      image: "https://i.ytimg.com/vi/xtFjyhcbCYo/maxresdefault.jpg",
    },
    {
      name: "Gió",
      singer: "Jank",
      path: "assets/music/Gio-Jank-8738046.mp3",
      image: "https://i.ytimg.com/vi/Mco-_BzZBUM/maxresdefault.jpg",
    },
    {
      name: "Ngày em đẹp nhất",
      singer: "Đại Mèo Remix",
      path: "assets/music/NgayEmDepNhatDaiMeoRemix-TamaVietNam-11099400.mp3",
      image: "https://i.ytimg.com/vi/cB7_EsNG6n4/maxresdefault.jpg",
    },
    {
      name: "Thiệp hồng em trao",
      singer: "Nhật Phong",
      path: "assets/music/ThiepHongEmTrao-NhatPhong-8900153.mp3",
      image: "https://i.ytimg.com/vi/N1cR1tdIoIk/maxresdefault.jpg",
    },

    {
      name: "4 mùa thương em",
      singer: "Lập Nguyên",
      path: "assets/music/4MuaThuongEm-LapNguyen-8365312.mp3",
      image: "https://i.ytimg.com/vi/FCmsrbP-fLM/maxresdefault.jpg",
    },
    {
      name: "À Lôi",
      singer: "Double2T - Masew",
      path: "assets/music/ALoi-Double2TMasew-10119691.mp3",
      image:
        "https://i.ytimg.com/vi/i9cg8cSOlS8/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGEcgUihlMA8=&rs=AOn4CLCjuxvSBq2kZs9uh5tjqJVKARJpiQ",
    },
    {
      name: "Cô gái này là của ai",
      singer: "Kri * Rush",
      path: "assets/music/CoGaiNayLaCuaAi-KrixRushDoanQuocVinhNhiNhi-6926198.mp3",
      image: "https://i.ytimg.com/vi/xtFjyhcbCYo/maxresdefault.jpg",
    },
    {
      name: "Gió",
      singer: "Jank",
      path: "assets/music/Gio-Jank-8738046.mp3",
      image: "https://i.ytimg.com/vi/Mco-_BzZBUM/maxresdefault.jpg",
    },
    {
      name: "Ngày em đẹp nhất",
      singer: "Đại Mèo Remix",
      path: "assets/music/NgayEmDepNhatDaiMeoRemix-TamaVietNam-11099400.mp3",
      image: "https://i.ytimg.com/vi/cB7_EsNG6n4/maxresdefault.jpg",
    },
    {
      name: "Thiệp hồng em trao",
      singer: "Nhật Phong",
      path: "assets/music/ThiepHongEmTrao-NhatPhong-8900153.mp3",
      image: "https://i.ytimg.com/vi/N1cR1tdIoIk/maxresdefault.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  // render
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return ` <div class="song ${
        index === this.currentIndex ? "active" : ""
      }"data-index="${index}">
      <div class="thumb" style="background-image: url('${song.image}')">
      </div>
      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>`;
    });

    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    //Xử lí  CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, //10 seconds
      iterations: Infinity,
    });
    cdThumbAnimate.pause();
    //Scroll top Xử lí phóng to / thu nhỏ CD

    document.onscroll = function () {
      const scollTop = window.scrollY || document.documentElement.scrollTop;
      const newcdWidth = cdWidth - scollTop;

      cd.style.width = newcdWidth > 0 ? newcdWidth + "px" : 0;
      cd.style.opacity = newcdWidth / cdWidth;
    };
    //Xử lí khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    //Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    //Khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    //khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    //Xử lí khi tua song
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };
    //Khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    //Khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    //Xử lí bật / tắt Ramdom bài hát
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };
    //Xử lí  Repeat bài hát
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };
    //Xử lí next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    // Lắng nghe hành vi click vào playlist

    playlist.onclick = function (e) {
      console.log(e.target);
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        //Xử lí khi click vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
          console.log(songNode.getAttribute("data-index"));
        }
        //Xử lí khi vào song option
        if (e.target.closest(".option")) {
        }
      }
    };
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (this.playedIndexes.includes(newIndex));
    this.playedIndexes.push(newIndex);
    if (this.playedIndexes.length === this.songs.length) {
      this.playedIndexes = [];
    }
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },
  start: function () {
    //Gán cấu hình từ config vào ứng dụng
    this.loadConfig();

    //Định nghĩa các thuộc tính cho object
    this.defineProperties();

    //Lắng nghe / xử lí các sự kiện
    this.handleEvents();

    //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    //Render playlist
    this.render();

    //Hiển thị trạng thái ban đầu của button repeat và random
    repeatBtn.classList.toggle("active", this.isRepeat);
    randomBtn.classList.toggle("active", this.isRandom);
  },
};
app.start();
