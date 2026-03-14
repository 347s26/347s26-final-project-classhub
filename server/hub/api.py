from ninja import NinjaAPI

api = NinjaAPI()

@api.get("/test")
def test(request, a: int, b: int):
    return { "result": a + b }
