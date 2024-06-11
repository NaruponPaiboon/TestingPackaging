// mockApi.js
import { SaveListMaterial, LitsTableResponse, GetMaterial } from "@/types/Api";
import { ref } from "vue";

export const saveListMaterial = (
  payload: SaveListMaterial[]
): Promise<SaveListMaterial[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // console.log("Save : ", payload);
      resolve(payload);
    }, 1000);
  });
};

export const fetchLitsTable = async (): Promise<LitsTableResponse[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          Material: "MAT0001",
          ProductCode: "PC000001",
          Location: "A1",
          QTY: 100,
        },
        {
          Material: "MAT0001",
          ProductCode: "PC000001",
          Location: "A2",
          QTY: 100,
        },
        {
          Material: "MAT0001",
          ProductCode: "PC000001",
          Location: "A4",
          QTY: 100,
        },
        {
          Material: "MAT0002",
          ProductCode: "PC000002",
          Location: "A1",
          QTY: 100,
        },
        {
          Material: "MAT0002",
          ProductCode: "PC000002",
          Location: "A3",
          QTY: 100,
        },
        {
          Material: "MAT0003",
          ProductCode: "PC000003",
          Location: "A1",
          QTY: 100,
        },
        {
          Material: "MAT0004",
          ProductCode: "PC000004",
          Location: "A2",
          QTY: 100,
        },
      ]);
    }, 1000);
  });
};

export const fetchMaterial = (payload: {
  Material: string;
}): Promise<GetMaterial[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = ref<GetMaterial[]>([]);
      const material = [
        {
          Material: "MAT0001",
          ProductCode: "PC000001",
          Description: "XXXXXXXXXXXX XXXX",
        },
        {
          Material: "MAT0002",
          ProductCode: "PC000002",
          Description: "XXXXXXXXXXXX XXXX",
        },
        {
          Material: "MAT0003",
          ProductCode: "PC000003",
          Description: "XXXXXXXXXXXX XXXX",
        },
        {
          Material: "MAT0004",
          ProductCode: "PC000004",
          Description: "XXXXXXXXXXXX XXXX",
        },
        {
          Material: "MAT0005",
          ProductCode: "PC000005",
          Description: "XXXXXXXXXXXX XXXX",
        },
        {
          Material: "MAT0006",
          ProductCode: "PC000006",
          Description: "XXXXXXXXXXXX XXXX",
        },
        {
          Material: "MAT0007",
          ProductCode: "PC000007",
          Description: "XXXXXXXXXXXX XXXX",
        },
        {
          Material: "MAT0008",
          ProductCode: "PC000008",
          Description: "XXXXXXXXXXXX XXXX",
        },
      ];
      const found = material.find((item) => item.Material == payload.Material);
      if (found) {
        results.value.push(found);
      }
      resolve(results.value);
    }, 1000);
  });
};
