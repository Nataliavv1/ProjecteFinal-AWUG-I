import React from "react";
import "./DietaryIcon.css"; // Archivo CSS para estilos personalizados.

// Importaciones explícitas para cada ícono
import vegetarian from "../icons/vegetarian.png"; // FET
import vegan from "../icons/vegan.png"; // FET
import pescatarian from "../icons/contains_fish.png"; // FET
import ketogenic from "../icons/keto.png"; // FET
import paleo from "../icons/paleo.png"; // FET
import primal from "../icons/primal.png"; // FET
/*import whole30 from "../icons/whole30.png";*/ // Ícono comentado porque falta el archivo
import lowCarb from "../icons/low_carb.png"; // FET
import lowFat from "../icons/low_fat.png"; // FET
import sugarConscious from "../icons/sugar_conscious.png"; // FET

// Intolerancias y Alérgenos
import glutenFree from "../icons/gluten_free.png"; // FET
import eggFree from "../icons/egg_free.png"; // FET
import peanutFree from "../icons/no_nuts.png"; // FET
/*import treeNutFree from "../icons/tree-nut-free.png";*/ // Ícono comentado porque falta el archivo
import soyFree from "../icons/soy_free.png"; // FET
import fishFree from "../icons/fish_free.png"; // FET
import wheatFree from "../icons/wheat_free.png"; // FET
import sesameFree from "../icons/sesame_free.png"; // FET
import sulfiteFree from "../icons/sulfit_free.png"; // FET
import celeryFree from "../icons/celery_free.png"; // FET
import mustardFree from "../icons/mustard_free.png"; // FET
import lupinFree from "../icons/lupin_free.png"; // FET
import molluskFree from "../icons/mollusk_free.png"; // FET

// Ícono genérico
/*import defaultIcon from "../icons/default.png";*/ // Ícono comentado porque falta el archivo

// Objeto de íconos con claves normalizadas
const dietaryIcons = {
  vegetarian,
  vegan,
  pescatarian,
  ketogenic,
  paleo,
  primal,
  /*whole30,*/ // Ícono comentado porque falta el archivo
  lowcarb: lowCarb,
  lowfat: lowFat,
  sugarconscious: sugarConscious,

  // Intolerancias y Alérgenos
  glutenfree: glutenFree,
  eggfree: eggFree,
  peanutfree: peanutFree,
  /*treenutfree,*/ // Ícono comentado porque falta el archivo
  soyfree: soyFree,
  fishfree: fishFree,
  wheatfree: wheatFree,
  sesamefree: sesameFree,
  sulfitefree: sulfiteFree,
  celeryfree: celeryFree,
  mustardfree: mustardFree,
  lupinfree: lupinFree,
  molluskfree: molluskFree,

  // Ícono genérico
  /*default: defaultIcon,*/ // Ícono comentado porque falta el archivo
};

const DietaryIcon = ({ diet }) => {
  const normalizedDiet = diet.toLowerCase().replace(/\s+/g, ""); // Normaliza el valor de diet
  const icon = dietaryIcons[normalizedDiet] || null; // Busca en el objeto
  return icon ? (
    <div className="dietary-icon">
      <img src={icon} alt={diet} className="icon-image" />
    </div>
  ) : null;
};

export default DietaryIcon;

