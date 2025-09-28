import uvicorn

if __name__ == "__main__":
    # Run without auto-reload to simplify debugging shutdown issues
    uvicorn.run("app.main:app", host="0.0.0.0", port=8088, reload=False, log_level="debug")
