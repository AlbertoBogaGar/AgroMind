
function limpiarTexto(texto) {
  return texto
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/ +\n/g, '\n')
    .trim();
}


function parseTemperaturas(texto) {
  const regexBloque = /TEMPERATURAS\s+M[IÍ]NIMAS\s+Y\s+M[AÁ]XIMAS\s+PREVISTAS\s+\(°C\):([\s\S]+?)(\n\s*\n|$)/i;
  const match = texto.match(regexBloque);

  if (!match) {
    console.warn("❌ No se encontró el bloque de temperaturas.");
    return null;
  }

  const bloque = match[1];
  const lineas = bloque.split('\n').map(l => l.trim()).filter(Boolean);

  const minimas = [];
  const maximas = [];

  for (const linea of lineas) {
    const partes = linea.match(/-?\d+\s+-?\d+$/); // Busca dos números al final
    if (partes) {
      const numeros = partes[0].trim().split(/\s+/).map(Number);
      if (numeros.length === 2) {
        minimas.push(numeros[0]);
        maximas.push(numeros[1]);
      }
    }
  }

  if (minimas.length === 0 || maximas.length === 0) {
    console.warn("⚠️ No se pudieron extraer los valores numéricos.");
    return null;
  }

  return {
    minima: Math.min(...minimas),
    maxima: Math.max(...maximas)
  };
}




  module.exports = {
    limpiarTexto,
    parseTemperaturas
  };