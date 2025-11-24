import React, { useState, useEffect } from "react";
import { Card } from "../../components/common/Card";
import { Input } from "../../components/common/Input";
import { Link } from "react-router-dom";
import { restaurantService } from "../../services/restaurantService";
import { type IRestaurant } from "../../interfaces/IRestaurant";
import { Loader } from "../../components/common/Loader";
import "./Client.css";

export const RestaurantsList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await restaurantService.getRestaurants();
      setRestaurants(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar a lista de restaurantes.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter((r) => {
    const search = searchTerm.toLowerCase();
    const nameMatch = (r.name || "").toLowerCase().includes(search);
    const typeMatch = (r.cuisineType || "").toLowerCase().includes(search);
    return nameMatch || typeMatch;
  });

  if (isLoading) return <Loader />;

  return (
    <div className="client-page-container">
      <h1>Restaurantes</h1>

      {error && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "20px" }}
        >
          {error}
        </div>
      )}

      <div className="profile-form profile-form-container">
        <div className="form-group">
          <Input
            placeholder="Busque por nome ou tipo de cozinha (ex: Japonesa)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: "24px", width: "100%" }}
          />
        </div>
      </div>

      {filteredRestaurants.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          Nenhum restaurante encontrado.
        </div>
      ) : (
        <div className="restaurant-list-grid">
          {filteredRestaurants.map((resto) => (
            <Link
              to={`/client/restaurants/${resto.id}/menu`}
              key={resto.id}
              className="restaurant-card-link"
            >
              <Card>
                <div className="restaurant-card-content">
                  <h3>{resto.name}</h3>
                  <p>
                    {resto.cuisineType || "Variada"}
                    • 30-45 min
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
