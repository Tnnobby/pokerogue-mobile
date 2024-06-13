import { router } from "expo-router";

const BASE_URL = "/pokedex";

export const usePokedex = () => {
  const navigateToPokemonPokedexPage = (name: string) => {
    let nameParam = "SPECIES_";
    switch (name) {
      case "Primal Kyogre":
        nameParam += "KYOGRE_PRIMAL";
        break;
      case "Primal Groudon":
        nameParam += "GROUDON_PRIMAL";
        break;
      case "Mega Charizard X":
        nameParam += "CHARIZARD_MEGA_X";
        break;
      case "Mega Charizard Y":
        nameParam += "CHARIZARD_MEGA_Y";
        break;
      case "Mega Mewtwo X":
        nameParam += "MEWTWO_MEGA_X";
        break;
      case "Mega Mewtwo Y":
        nameParam += "MEWTWO_MEGA_Y";
        break;

      default:
        if (name.includes("G-Max ")) {
          nameParam +=
            name.toUpperCase().split("G-MAX ")[1].split(" ").join("_") +
            "_GIGANTAMAX";
          break;
        }
        if (name.includes("E-Max ")) {
          nameParam +=
            name.toUpperCase().split("E-MAX ")[1].split(" ").join("_") +
            "_ETERNAMAX";
          break;
        }
        if (name.includes("Mega ")) {
          nameParam +=
            name.toUpperCase().split("MEGA ")[1].split(" ").join("_") + "_MEGA";
          break;
        }
        nameParam += name.toUpperCase().replace("-", " ").split(" ").join("_");
    }

    const params = new URLSearchParams();
    params.append("species", nameParam);
    router.push(`${BASE_URL}?${params.toString()}`);
  };

  const navigateToBiomePokedexPage = (biome: string) => {
    const params = new URLSearchParams();
    params.append("table", "locationsTable");
    biome && params.append("filter", `Biome:${biome}`);
    router.push(`${BASE_URL}?${params.toString()}`);
  };

  const navigateToAbilityPokedexPage = () => {
    const params = new URLSearchParams();
  };

  return {
    navigateToPokemonPokedexPage,
    navigateToBiomePokedexPage,
  };
};
