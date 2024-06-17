import prisma from './db';
import { Tag } from "@/types/tag";

export async function getItems<T>(): Promise<T[] | Error> {
  try{
    const tags = await prisma.tag.findMany();

    return tags;
  } catch (error: any) {
    console.error('Tag retrieval error:', error);
    
    return { error };
  }
}

export async function getItem<T>(id: number): Promise<T | Error | null> {
  try{
    const item = await prisma.tag.findFirst({
      where: { tag_id: id },
    });
    return item;
  } catch (error) {
    console.log('QUERY ERROR');
    console.log(String(error));

    return { error }
  }
  //return results as QueryReturn<OptionAndItems>;
}

export const create = async (data: Tag): Promise<Tag | Error> => {
  console.log('creating tag .... ', data);
  try {
    const createdItem = await prisma.tag.create({data: data});
    return createdItem;
  } catch (error: unknown) {
    console.log('QUERY ERROR');
    console.error('Tag creation error:', error);

    return error as Error;    
  }
}

export const update = async (itemData: Tag): Promise<Tag | Error> => {
  try {
    const updatedItem = await prisma.tag.update({
      where: { tag_id: itemData.tag_id },
      data: itemData
    });
    return updatedItem;    
  } catch (error) {
    console.log('QUERY ERROR');
    console.log(String(error));
    return { error }
  }
}

export const deleteItem = async (item_id: number): Promise<Tag | Error> => {
  try {
    const deletedItem = await prisma.tag.delete({
      where: { tag_id: item_id }
    });
    return deletedItem;      
  } catch (error) {
    console.log('QUERY ERROR');
    console.log(String(error));
    return { error }
  }
}
