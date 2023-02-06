import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const noteId = req.query.id;
    if(req.method === 'DELETE'){
        const note = await prisma.note.delete({
            where: {id: Number(noteId)}
        })
        res.json(note)
    }

    if(req.method === 'PUT'){
        console.log(req.body.title)
        const title: string = req.body.title as string;
        const content: string = req.body.content as string;
        
        const note =   await prisma.note.update({
              where: { id: Number(noteId) },
              data: {
                title,
                content,
              },
            });

            res.json(note);
    }

}