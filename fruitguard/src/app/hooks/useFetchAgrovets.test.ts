import { renderHook, act } from "@testing-library/react";
import { useFetchAgrovets } from "./useFetchAgrovets";
import { fetchAgrovets } from "../utils/fetchAgrovets"; 

jest.mock("../utils/fetchAgrovets", () => ({
  fetchAgrovets: jest.fn(),
}));

const mockAgrovetApiResult = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    phone_number: "123456789",
    number_of_traps: 3,
    devices: [{ id: "d1", name: "Device 1" }],
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    phone_number: "987654321",
    number_of_traps: 2,
 
  },
];

describe("useFetchAgrovets", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set loading true initially", async () => {
    (fetchAgrovets as jest.Mock).mockReturnValue(new Promise(() => {})); 
    const { result } = renderHook(() => useFetchAgrovets());
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.agrovets).toEqual([]);
    expect(result.current.agrovetsCount).toBe(0);
  });

  it("should fetch and map agrovets correctly", async () => {
    (fetchAgrovets as jest.Mock).mockResolvedValue(mockAgrovetApiResult);

    const { result } = renderHook(() => useFetchAgrovets());
    await act(async () => {
      await Promise.resolve();
    });

    expect(fetchAgrovets).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.agrovets).toEqual([
      {
        ...mockAgrovetApiResult[0],
        name: "John Doe",
        phone: "123456789",
        traps: 3,
        devices: [{ id: "d1", name: "Device 1" }],
      },
      {
        ...mockAgrovetApiResult[1],
        name: "Jane Smith",
        phone: "987654321",
        traps: 2,
        devices: [],
      },
    ]);
    expect(result.current.agrovetsCount).toBe(2);
  });

  it("should handle errors and set error message", async () => {
    (fetchAgrovets as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useFetchAgrovets());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Network error");
    expect(result.current.agrovets).toEqual([]);
    expect(result.current.agrovetsCount).toBe(0);
  });
});