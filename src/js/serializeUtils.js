export function serializeToJsonText(cardArray) {
  const cardDtoArray = cardArray.map((card) => {
    return {
      data: card.data,
      column: card.ownerElement.closest(".column").dataset["num"],
    };
  });
  return JSON.stringify(cardDtoArray);
}

export function deserializeFromJsonText(text) {
  return JSON.parse(text);
}
