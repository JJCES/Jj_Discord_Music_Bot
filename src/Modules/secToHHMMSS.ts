function secToHHMSS(second: string | number) {
    if (isNaN(Number(second))) return "라이브 스트리밍은 지원되지 않습니다!";
    if (second === 0 || second === "0") return "잘못된 영상입니다.";
    second = second.toString();
    let sec_num = parseInt(second, 10); // don't forget the second param
    let hours: string | number = Math.floor(sec_num / 3600);
    let minutes: string | number = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds: string | number = sec_num - (hours * 3600) - (minutes * 60);
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    if (hours <= 0) {
        return minutes + ':' + seconds;
    } else {
        return hours + ':' + minutes + ':' + seconds;
    }
};

export default secToHHMSS;