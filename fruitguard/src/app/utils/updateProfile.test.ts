import { updateProfile } from "./updateProfile";

const baseUrl = 'api/updateprofile';

describe('updateProfile', () => {
    beforeEach(() => { global.fetch = jest.fn(); });

    afterEach(() => { jest.resetAllMocks(); });

    const token = '123456789est';
    const mockFormData = new FormData();

    it('sends PUT request and returns JSON response on success', async () => {
        const mockResponseData = { success: true };
        (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, 
            json: jest.fn().mockResolvedValueOnce(mockResponseData),
        });

        const result = await updateProfile(token, mockFormData);

        expect(fetch).toHaveBeenCalledWith(baseUrl, {
            method: 'PUT',
            headers: { Authorization: `Token ${token}` },
            body: mockFormData,
        });
        expect(result).toEqual(mockResponseData);
    });

    it('throws error with statusText on non-ok response', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({ok: false,
            statusText:'Bad Request',
            headers:{get:()=> null},
            json: jest.fn(), 
            text:jest.fn(),
    });
        await expect(updateProfile(token, mockFormData)).rejects.toThrow("Something went wrong while updating the profile: Failed to update profile: Bad Request");
    });

    it('throws error when fetch fails', async () => {
        (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));

        await expect(updateProfile(token, mockFormData)).rejects.toThrow("Something went wrong while updating the profile: Network failure");
    });
});

