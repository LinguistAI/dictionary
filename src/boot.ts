import app from "./app";

app.init().then(() => {
    app.listen();
})
.catch((err) => {
    console.log(err);
    process.exit(1);
});