import { FeedItem } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from 'src/prisma';
import { logger } from 'src/server';
const feed = {
  async getFeed(req: Request, res: Response) {
    // logic to get the feed of posts
    const userId = parseInt(req.body.userId);

    try {
      // 1️⃣ users that the user follows
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
      const followingIds = following.map((f) => f.followingId);

      // 2️⃣ tag of interest of the user
      const interests = await prisma.osuUser.findUnique({
        where: { id: userId },
        include: { interests: true },
      });

      const interestNames = interests?.interests.map((t) => t.name) || [];

      // 3️⃣ fetch posts
      const posts = await prisma.feedItem.findMany({
        where: {
          OR: [
            { userId: { in: followingIds } }, // posts de seguidos
            { tags: { some: { name: { in: interestNames } } } }, // tags que me gustan
          ],
        },
        include: {
          user: { select: { id: true, username: true, avatarUrl: true } },
          _count: { select: { likes: true } },
          tags: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      // 4️⃣ score posts

      const scoredPosts = posts.map((p) => {
        let score = 0;
        if (followingIds.includes(p.userId)) score += 5;
        if (p.tags.some((t) => interestNames.includes(t.name))) score += 3;
        score += Math.floor(p._count.likes / 10);
        const age = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60);
        if (age < 24) score += 2;
        return { ...p, score };
      });

      scoredPosts.sort((a, b) => b.score - a.score);
      res.json(scoredPosts);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Error al generar feed personalizado' });
    }
  },
  async createPost(req: Request, res: Response) {
    // logic to create a new post
    const { userId, Title, content }: FeedItem = req.body;
    const tags = req.body.tags || [];

    try {
      const newPost = await prisma.feedItem.create({
        data: {
          userId,
          Title,
          content,
          tags: {
            connectOrCreate: tags.map((tagName: string) => ({
              where: { name: tagName },
              create: { name: tagName },
            })),
          },
        },
      });
      res.redirect(`http://10.0.0.810:5173/feed/${newPost.id}`);
    } catch (error) {
      logger.error(`Error creating post: ${error}`);
      res.status(500).json({ error: 'Error al crear el post' });
    }
  },
  async getPostbyId(req: Request, res: Response) {
    // logic to get a specific post
    const postId = parseInt(req.params.id);
    try {
      const post = await prisma.feedItem.findUnique({
        where: { id: postId },
      });
      if (!post) {
        return res.status(404).json({ error: 'Post no encontrado' });
      }
      res.status(200).json(post);
    } catch (error) {
      logger.error(`Error fetching post by ID: ${error}`);
      res.status(500).json({ error: 'Error al obtener el post' });
    }
  },
  async updatePost(req: Request, res: Response) {
    // logic to update a specific post
    const postId = parseInt(req.params.id);
    const { Title, content } = req.body;

    try {
      const exixtingPost = await prisma.feedItem.findUnique({
        where: { id: postId },
      });
      if (!exixtingPost) {
        return res.status(404).json({ error: 'Post no encontrado' });
      }
      const updatedPost = await prisma.feedItem.update({
        where: { id: postId },
        data: { Title, content },
      });
      res.status(200).json(updatedPost);
    } catch (error) {
      logger.error(`Error updating post: ${error}`);
      res.status(500).json({ error: 'Error al actualizar el post' });
    }
  },
  async deletePost(req: Request, res: Response) {
    // logic to delete a specific post
    const postId = parseInt(req.params.id);
    try {
      const existingPost = await prisma.feedItem.findUnique({
        where: { id: postId },
      });
      if (!existingPost) {
        return res.status(404).json({ error: 'Post no encontrado' });
      }
      await prisma.feedItem.delete({
        where: { id: postId },
      });
      res.status(200).redirect('http://10.0.0.810:5173/feed');
    } catch (error) {
      logger.error(`Error deleting post: ${error}`);
      res.status(500).json({ error: 'Error al eliminar el post' });
    }
  },
  async likePost(req: Request, res: Response) {
    // logic to like or unlike a post
    const postId = parseInt(req.params.id, 10);
    const userId = parseInt(req.body.userId, 10);

    try {
      // use findFirst for composite lookups when there's no single unique field exposed
      const existingLike = await prisma.like.findFirst({
        where: { postId, userId },
      });

      if (existingLike) {
        await prisma.like.delete({ where: { id: existingLike.id } });
        return res.status(200).json({ liked: false });
      }

      const newLike = await prisma.like.create({
        data: { postId, userId },
      });

      return res.status(201).json({ liked: true, likeId: newLike.id });
    } catch (error) {
      logger.error(`Error liking/unliking post: ${error}`);
      return res.status(500).json({ error: 'Error liking/unliking post' });
    }
  },
  async commentPost(req: Request, res: Response) {
    // logic to add a comment to a post
    const postId = parseInt(req.params.id);
    const userId = parseInt(req.body.userId);
    const content = req.body.content;

    try {
      const newComment = await prisma.comment.create({
        data: { postId, userId, content },
      });
      return res.status(201).json(newComment);
    } catch (error) {
      logger.error(`Error adding comment to post: ${error}`);
      return res.status(500).json({ error: 'Error adding comment to post' });
    }
  },
  async likeComment(req: Request, res: Response) {
    // logic to like or unlike a comment
    const commentId = parseInt(req.params.commentId);
    const userId = parseInt(req.body.userId);
    try {
      const existingLike = await prisma.like.findFirst({
        where: { commentId, userId },
      });
      if (existingLike) {
        const eliminatedLike = await prisma.like.delete({
          where: { id: existingLike.id },
        });
        return res.status(200).json({ liked: false });
      }
      const newLike = await prisma.like.create({
        data: { commentId, userId },
      });
      return res.status(201).json({ liked: true, likeId: newLike.id });
    } catch (error) {
      logger.error(`Error linking/unlinking comment: ${error}`);
    }
  },
};
export default feed;
