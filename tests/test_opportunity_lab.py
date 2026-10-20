from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_opportunity_lab_route_returns_independent_five_theme_page():
    response = client.get("/opportunity-lab")

    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
    page = response.text
    for marker in (
        "Real-Estate Operations Intelligence Lab",
        "LaunchIQ",
        "ConstructionIQ",
        "DocumentIQ",
        "VendorIQ",
        "ServiceIQ",
        "Synthetic demo data",
        "not an official Prestige Group product",
    ):
        assert marker.lower() in page.lower()


def test_project_impact_lab_home_route_is_preserved():
    response = client.get("/")

    assert response.status_code == 200
    assert "Project Impact Lab" in response.text
    assert "Float-Burn Watch" in response.text
