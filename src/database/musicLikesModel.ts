import { pool } from "./pool";

class MusicLikesModel {
    static async likeMusic(userId: number, musicId: number) {
        const [existingLike]: any = await pool.query(
            'SELECT * FROM music_likes WHERE user_id = ? AND music_id = ?',
            [userId, musicId]
        );

        if (existingLike.length > 0) {
            // Déliker
            await pool.query('DELETE FROM music_likes WHERE user_id = ? AND music_id = ?', [userId, musicId]);
            await pool.query('UPDATE musique SET likes_count = likes_count - 1 WHERE id = ?', [musicId]);
            return { message: 'Like retiré' };
        } else {
            // Liker
            await pool.query('INSERT INTO music_likes (user_id, music_id) VALUES (?, ?)', [userId, musicId]);
            await pool.query('UPDATE musique SET likes_count = likes_count + 1 WHERE id = ?', [musicId]);
            return { message: 'Musique likée' };
        }
    }

    static async getPopularMusic(period: string) {
        let dateCondition = "NOW() - INTERVAL 1 DAY";
        if (period === 'week') dateCondition = "NOW() - INTERVAL 1 WEEK";
        if (period === 'month') dateCondition = "NOW() - INTERVAL 1 MONTH";

        const [rows]: any = await pool.query(`
            SELECT m.id, m.titre, m.artiste, m.likes_count
            FROM musique m
            ORDER BY m.likes_count DESC
            LIMIT 10;
        `);

        return rows;
    }
}

export default MusicLikesModel;
