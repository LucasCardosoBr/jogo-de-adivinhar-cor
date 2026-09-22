/* =========================
   CORES PRINCIPAIS
========================= */

export const colors = [
    {
        name: "Vermelho",
        hex: "#FF0000",
        rgb: "rgb(255, 0, 0)",
        hsl: "hsl(0, 100%, 50%)"
    },

    {
        name: "Verde",
        hex: "#00FF00",
        rgb: "rgb(0, 255, 0)",
        hsl: "hsl(120, 100%, 50%)"
    },

    {
        name: "Azul",
        hex: "#0000FF",
        rgb: "rgb(0, 0, 255)",
        hsl: "hsl(240, 100%, 50%)"
    },

    {
        name: "Amarelo",
        hex: "#FFFF00",
        rgb: "rgb(255, 255, 0)",
        hsl: "hsl(60, 100%, 50%)"
    },

    {
        name: "Laranja",
        hex: "#FFA500",
        rgb: "rgb(255, 165, 0)",
        hsl: "hsl(39, 100%, 50%)"
    },

    {
        name: "Roxo",
        hex: "#800080",
        rgb: "rgb(128, 0, 128)",
        hsl: "hsl(300, 100%, 25%)"
    },

    {
        name: "Rosa",
        hex: "#FFC0CB",
        rgb: "rgb(255, 192, 203)",
        hsl: "hsl(350, 100%, 88%)"
    },

    {
        name: "Ciano",
        hex: "#00FFFF",
        rgb: "rgb(0, 255, 255)",
        hsl: "hsl(180, 100%, 50%)"
    },

    {
        name: "Cinza",
        hex: "#808080",
        rgb: "rgb(128, 128, 128)",
        hsl: "hsl(0, 0%, 50%)"
    },

    {
        name: "Preto",
        hex: "#000000",
        rgb: "rgb(0, 0, 0)",
        hsl: "hsl(0, 0%, 0%)"
    }
];


/* =========================
   CORES DIFÍCEIS
========================= */

export const hardColors = [
    {
        name: "Azul Profundo",
        hex: "#173B8F",
        rgb: "rgb(23, 59, 143)",
        hsl: "hsl(224, 72%, 33%)"
    },

    {
        name: "Azul Escuro",
        hex: "#1E40AF",
        rgb: "rgb(30, 64, 175)",
        hsl: "hsl(224, 71%, 40%)"
    },

    {
        name: "Azul Forte",
        hex: "#1D4ED8",
        rgb: "rgb(29, 78, 216)",
        hsl: "hsl(221, 76%, 48%)"
    },

    {
        name: "Azul Vivo",
        hex: "#2563EB",
        rgb: "rgb(37, 99, 235)",
        hsl: "hsl(217, 83%, 53%)"
    },

    {
        name: "Azul Médio",
        hex: "#2F6FED",
        rgb: "rgb(47, 111, 237)",
        hsl: "hsl(219, 84%, 56%)"
    },

    {
        name: "Azul Claro",
        hex: "#3B82F6",
        rgb: "rgb(59, 130, 246)",
        hsl: "hsl(217, 91%, 60%)"
    },

    {
        name: "Azul Suave",
        hex: "#4F8FF7",
        rgb: "rgb(79, 143, 247)",
        hsl: "hsl(216, 91%, 64%)"
    },

    {
        name: "Azul Céu",
        hex: "#60A5FA",
        rgb: "rgb(96, 165, 250)",
        hsl: "hsl(213, 94%, 68%)"
    },

    {
        name: "Azul Pálido",
        hex: "#7CB4FA",
        rgb: "rgb(124, 180, 250)",
        hsl: "hsl(212, 91%, 73%)"
    },

    {
        name: "Azul Muito Claro",
        hex: "#93C5FD",
        rgb: "rgb(147, 197, 253)",
        hsl: "hsl(214, 97%, 78%)"
    }
];


/* =========================
   CONFIGURAÇÃO DE DIFICULDADE
========================= */

export const difficultyConfig = {

    easy: {
        options: 3,
        attempts: 5,
        memoryOptions: 4
    },

    medium: {
        options: 6,
        attempts: 4,
        memoryOptions: 6
    },

    hard: {
        options: 6,
        attempts: 3,
        memoryOptions: 9
    }

};


/* =========================
   EMBARALHAR ARRAY
========================= */

export function shuffle(array) {

    const result = [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [
            result[i],
            result[j]
        ] = [
            result[j],
            result[i]
        ];
    }

    return result;
}


/* =========================
   OBTER VALOR DA COR
========================= */

export function getColorValue(
    color,
    format
) {

    if (!color) {
        return "";
    }

    if (
        format !== "hex" &&
        format !== "rgb" &&
        format !== "hsl"
    ) {
        return color.rgb;
    }

    return color[format];
}