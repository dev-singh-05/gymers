import { create } from 'zustand';

export interface JoinedProgram {
    id: string;
    name: string;
    price: number;
}

interface ProgramStore {
    joinedPrograms: JoinedProgram[];
    addProgram: (program: JoinedProgram) => void;
    removeProgram: (id: string) => void;
    isJoined: (id: string) => boolean;
    getTotalPrice: () => number;
    getProgramCount: () => number;
}

export const useProgramStore = create<ProgramStore>((set, get) => ({
    joinedPrograms: [],

    addProgram: (program) => {
        const { joinedPrograms } = get();
        if (!joinedPrograms.find((p) => p.id === program.id)) {
            set({ joinedPrograms: [...joinedPrograms, program] });
        }
    },

    removeProgram: (id) => {
        set((state) => ({
            joinedPrograms: state.joinedPrograms.filter((p) => p.id !== id),
        }));
    },

    isJoined: (id) => {
        return get().joinedPrograms.some((p) => p.id === id);
    },

    getTotalPrice: () => {
        return get().joinedPrograms.reduce((sum, p) => sum + p.price, 0);
    },

    getProgramCount: () => {
        return get().joinedPrograms.length;
    },
}));
