import { renderHook, act } from "@testing-library/react";
import { useFetchDevices } from "./useFetchDevices";
import { fetchDevices } from "../utils/fetchDevices";

jest.mock("../utils/fetchDevices", () => ({
  fetchDevices: jest.fn(),
}));


const mockDevices = [
  { id: 1, name: "Trap 1", status: "active" },
  { id: 2, name: "Trap 2", status: "inactive" },
];

describe("useFetchDevices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set loading to true initially", () => {
    (fetchDevices as jest.Mock).mockReturnValue(new Promise(() => {})); 
    const { result } = renderHook(() => useFetchDevices());
    expect(result.current.loading).toBe(true);
    expect(result.current.devices).toEqual([]);
    expect(result.current.trapsCount).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it("should fetch and set devices and trapsCount correctly", async () => {
    (fetchDevices as jest.Mock).mockResolvedValue(mockDevices);
    const { result } = renderHook(() => useFetchDevices());

    await act(async () => {
      await Promise.resolve();
    });

    expect(fetchDevices).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.devices).toEqual(mockDevices);
    expect(result.current.trapsCount).toBe(mockDevices.length);
  });

  it("should handle fetch error and set error message", async () => {
    (fetchDevices as jest.Mock).mockRejectedValue(new Error("Device fetch failed"));
    const { result } = renderHook(() => useFetchDevices());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Device fetch failed");
    expect(result.current.devices).toEqual([]);
    expect(result.current.trapsCount).toBe(0);
  });

    it("should handle empty devices array correctly", async () => {
      (fetchDevices as jest.Mock).mockResolvedValue([]);
      const { result } = renderHook(() => useFetchDevices());
    
      await act(async () => {
        await Promise.resolve();
      });
    
      expect(fetchDevices).toHaveBeenCalledTimes(1);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.devices).toEqual([]);
      expect(result.current.trapsCount).toBe(0);
    });
      

    
});